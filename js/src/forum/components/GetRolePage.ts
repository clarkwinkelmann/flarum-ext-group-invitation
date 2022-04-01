import {Vnode} from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import GroupBadge from 'flarum/common/components/GroupBadge';
import LogInModal from 'flarum/forum/components/LogInModal';
import avatar from 'flarum/common/helpers/avatar';
import Invitation from '../../common/Invitation';

const translationPrefix = 'clarkwinkelmann-group-invitation.forum.';

export default class GetRolePage extends Page {
    loading: boolean = false;
    invitation: Invitation | null | false = null;

    oninit(vnode: Vnode) {
        super.oninit(vnode);

        this.loading = false;

        this.invitation = null;

        app.store.find<Invitation>('group-invitations', m.route.param('code'), {}, {
            errorHandler: () => {
                this.invitation = false; // Not found
                m.redraw();
            },
        }).then(invitation => {
            this.invitation = invitation;
            m.redraw();
        });
    }

    view() {
        if (this.invitation === null) {
            return m('.GroupInvitationPage', [
                m('h2', app.translator.trans(translationPrefix + 'generic-title')),
                LoadingIndicator.component(),
            ]);
        }

        const user = app.session.user;
        const group = this.invitation && this.invitation.group();

        // There should always be a group relationship, but this is the easiest fail safe
        if (this.invitation === false || !group) {
            return m('.GroupInvitationPage', [
                m('h2', app.translator.trans(translationPrefix + 'generic-title')),
                m('p', app.translator.trans(translationPrefix + 'invitation.not-found')),
            ]);
        }

        let userText;
        let disabled = true;

        if (user) {
            if ((user.groups() || []).some(g => g && g.id() === group.id())) {
                userText = 'already-member';
            } else if (this.invitation.canUse()) {
                userText = 'already-connected';
                disabled = false;
            } else {
                userText = 'not-authorized';
            }
        } else {
            userText = 'not-connected';
        }

        return m('.GroupInvitationPage', [
            m('h2', app.translator.trans(translationPrefix + 'title', {
                group: group.namePlural(),
            })),
            m('.GroupInvitationSchema', [
                avatar(user as any), // Must cast to any because Flarum doesn't type-hint missing users
                m('span.GroupInvitationPlus', '+'),
                GroupBadge.component({
                    group,
                }),
            ]),
            m('p.GroupInvitationConfirmation', this.invitation.hasUsagesLeft() ? app.translator.trans(translationPrefix + 'user.' + userText, {
                user,
                group: m('span.group', group.namePlural()),
                a: m('a', {
                    onclick(event: Event) {
                        event.preventDefault();
                        app.modal.show(LogInModal);
                    },
                })
            }) : app.translator.trans(translationPrefix + 'invitation.no-usages-left')),
            m('.Form-group.Form--centered', Button.component({
                className: 'Button Button--primary Button--block',
                loading: this.loading,
                disabled,
                onclick: () => {
                    this.loading = true;

                    app.request({
                        url: app.forum.attribute('apiUrl') + '/group-invitations/' + (this.invitation as Invitation).code() + '/apply',
                        method: 'POST',
                    }).then(() => {
                        this.loading = false;

                        // Memorize success to show an alert after refresh
                        localStorage.setItem('groupInvitationSuccess', 'true');

                        // Force a refresh to get the new badges and permissions
                        window.location = app.forum.attribute('baseUrl');
                    }).catch(e => {
                        this.loading = false;
                        m.redraw();
                        throw e;
                    });
                },
            }, app.translator.trans(translationPrefix + 'apply'))),
        ]);
    }
}

import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import GroupBadge from 'flarum/components/GroupBadge';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import GroupSelect from './GroupSelect';

/* global m */

const translationPrefix = 'clarkwinkelmann-group-invitation.admin.settings.';

export default class InviteModal extends Modal {
    className() {
        return 'GroupInvitationSettingsModal Modal--large';
    }

    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    oninit(vnode) {
        super.oninit(vnode);

        this.invitations = null;

        app.store.find('group-invitations').then(invitations => {
            this.invitations = invitations;
            m.redraw();
        });

        this.loading = false;

        this.newInvitationGroupId = '';
        this.newInvitationMaxUsage = '';
    }

    content() {
        return m('.Modal-body', [
            m('table', [
                m('thead', m('tr', [
                    m('th', app.translator.trans(translationPrefix + 'head.code')),
                    m('th', app.translator.trans(translationPrefix + 'head.group')),
                    m('th', app.translator.trans(translationPrefix + 'head.usage')),
                    m('th'),
                ])),
                m('tbody', [
                    this.invitations === null ? m('tr', m('td', LoadingIndicator.component())) : [
                        this.invitations.map((invitation, index) => m('tr', [
                            m('td', m('a', {
                                href: app.forum.attribute('baseUrl') + '/get-role/' + invitation.code(),
                                target: '_blank',
                            }, m('code', invitation.code()))),
                            m('td', [
                                GroupBadge.component({
                                    group: invitation.group(),
                                }),
                                ' ',
                                invitation.group().namePlural(),
                            ]),
                            m('td', invitation.usageCount() + '/' + (invitation.maxUsage() === null ? app.translator.trans(translationPrefix + 'unlimited') : invitation.maxUsage())),
                            m('td', Button.component({
                                className: 'Button Button--danger',
                                onclick: () => {
                                    this.loading = true;

                                    invitation.delete().then(() => {
                                        this.loading = false;

                                        this.invitations.splice(index, 1);
                                        m.redraw();
                                    }).catch(e => {
                                        this.loading = false;
                                        m.redraw();
                                        throw e;
                                    });
                                },
                                loading: this.loading,
                            }, app.translator.trans(translationPrefix + 'delete'))),
                        ])),
                        this.invitations.length === 0 ? m('tr.NoResultRow', m('td', {
                            colspan: 4,
                        }, m('em', app.translator.trans(translationPrefix + 'empty')))) : null,
                    ],
                    m('tr', [
                        m('td', m('em', app.translator.trans(translationPrefix + 'placeholder.code'))),
                        m('td', m(GroupSelect, {
                            onchange: value => {
                                this.newInvitationGroupId = value;
                            },
                            value: this.newInvitationGroupId,
                        })),
                        m('td', m('input.FormControl', {
                            type: 'number',
                            min: '0',
                            onchange: event => {
                                const value = event.target.value;
                                this.newInvitationMaxUsage = value === '0' ? '' : value;
                            },
                            value: this.newInvitationMaxUsage,
                            placeholder: app.translator.trans(translationPrefix + 'placeholder.usage'),
                        })),
                        m('td', Button.component({
                            className: 'Button Button--primary',
                            onclick: () => {
                                this.loading = true;

                                app.request({
                                    method: 'POST',
                                    url: app.forum.attribute('apiUrl') + '/group-invitations',
                                    body: {
                                        groupId: this.newInvitationGroupId,
                                        maxUsage: this.newInvitationMaxUsage,
                                    }
                                }).then(data => {
                                    this.loading = false;

                                    this.invitations.push(app.store.pushPayload(data));
                                    this.newInvitationGroupId = '';
                                    this.newInvitationMaxUsage = '';
                                    m.redraw();
                                }).catch(e => {
                                    this.loading = false;
                                    m.redraw();
                                    throw e;
                                });
                            },
                            loading: this.loading,
                            disabled: !this.newInvitationGroupId,
                        }, app.translator.trans(translationPrefix + 'create'))),
                    ]),
                ]),
            ]),
        ]);
    }
}

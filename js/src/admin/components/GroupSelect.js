import Group from 'flarum/common/models/Group';
import icon from 'flarum/common/helpers/icon';

/* global app, m */

export default class GroupSelect {
    view(vnode) {
        const {
            onchange,
            value,
        } = vnode.attrs;

        return m('span.Select', [
            m('select.Select-input.FormControl', {
                onchange: event => {
                    onchange(event.target.value);
                },
                value,
            }, [
                m('option', {
                    value: '',
                    disabled: true,
                    hidden: true,
                }, app.translator.trans('clarkwinkelmann-group-invitation.admin.settings.placeholder.group')),
                app.store
                    .all('groups')
                    .filter((group) => [Group.GUEST_ID, Group.MEMBER_ID].indexOf(group.id()) === -1)
                    .map((group) => m('option', {
                        value: group.id()
                    }, group.namePlural())),
            ]),
            icon('fas fa-sort', {className: 'Select-caret'}),
        ]);
    }
}

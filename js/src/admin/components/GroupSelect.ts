import {ClassComponent, Vnode} from 'mithril';
import app from 'flarum/admin/app';
import Group from 'flarum/common/models/Group';
import icon from 'flarum/common/helpers/icon';

interface GroupSelectAttrs {
    onchange: (value: string) => void
    value: string
}

export default class GroupSelect implements ClassComponent<GroupSelectAttrs> {
    view(vnode: Vnode<GroupSelectAttrs, this>) {
        const {
            onchange,
            value,
        } = vnode.attrs;

        return m('span.Select', [
            m('select.Select-input.FormControl', {
                onchange: (event: Event) => {
                    onchange((event.target as HTMLInputElement).value);
                },
                value,
            }, [
                m('option', {
                    value: '',
                    disabled: true,
                    hidden: true,
                }, app.translator.trans('clarkwinkelmann-group-invitation.admin.settings.placeholder.group')),
                app.store
                    .all<Group>('groups')
                    .filter((group) => [Group.GUEST_ID, Group.MEMBER_ID].indexOf(group.id()!) === -1)
                    .map((group) => m('option', {
                        value: group.id()
                    }, group.namePlural())),
            ]),
            icon('fas fa-sort', {className: 'Select-caret'}),
        ]);
    }
}

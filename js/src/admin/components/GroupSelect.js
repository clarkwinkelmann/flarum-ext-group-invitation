import app from 'flarum/app';
import Component from 'flarum/Component';
import Group from 'flarum/models/Group';
import icon from 'flarum/helpers/icon';

/* global m */

export default class GroupSelect extends Component {
    view() {
        const {
            onchange,
            value,
        } = this.props;

        return m('span.Select', [
            m('select.Select-input.FormControl', {
                onchange: m.withAttr('value', onchange.bind(this)),
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

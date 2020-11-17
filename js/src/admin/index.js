import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import SettingsModal from './components/SettingsModal';
import Invitation from '../common/Invitation';

app.initializers.add('clarkwinkelmann-group-invitation', () => {
    app.extensionSettings['clarkwinkelmann-group-invitation'] = () => app.modal.show(SettingsModal);

    app.store.models['group-invitations'] = Invitation;

    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('clarkwinkelmann-group-invitation-use', {
            icon: 'fas fa-certificate',
            label: app.translator.trans('clarkwinkelmann-group-invitation.admin.permissions.use'),
            permission: 'clarkwinkelmann-group-invitation.use',
        });
    });
});

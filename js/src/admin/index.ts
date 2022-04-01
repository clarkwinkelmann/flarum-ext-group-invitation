import app from 'flarum/admin/app';
import Invitation from '../common/Invitation';
import SettingsPage from './components/SettingsPage';

app.initializers.add('clarkwinkelmann-group-invitation', () => {
    app.store.models['group-invitations'] = Invitation;

    app.extensionData.for('clarkwinkelmann-group-invitation')
        .registerPage(SettingsPage)
        .registerPermission({
            icon: 'fas fa-certificate',
            label: app.translator.trans('clarkwinkelmann-group-invitation.admin.permissions.use'),
            permission: 'clarkwinkelmann-group-invitation.use',
        }, 'start');
});

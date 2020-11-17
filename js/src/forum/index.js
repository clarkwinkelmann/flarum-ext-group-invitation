import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Invitation from '../common/Invitation';
import GetRolePage from './components/GetRolePage';

/* global m */

app.initializers.add('clarkwinkelmann-group-invitation', () => {
    app.store.models['group-invitations'] = Invitation;

    app.routes.clarkwinkelmannGroupInvitation = {
        path: '/get-role/:code',
        component: GetRolePage,
    };

    extend(app, 'mount', () => {
        if (localStorage.getItem('groupInvitationSuccess')) {
            localStorage.removeItem('groupInvitationSuccess');

            app.alerts.show({
                type: 'success',
            }, app.translator.trans('clarkwinkelmann-group-invitation.forum.success-alert'));
        }
    });
});

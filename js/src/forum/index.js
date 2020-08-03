import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Alert from 'flarum/components/Alert';
import Invitation from '../common/Invitation';
import GetRolePage from './components/GetRolePage';

/* global m */

app.initializers.add('clarkwinkelmann-group-invitation', () => {
    app.store.models['group-invitations'] = Invitation;

    app.routes.clarkwinkelmannGroupInvitation = {
        path: '/get-role/:code',
        component: GetRolePage.component(),
    };

    extend(app, 'mount', () => {
        if (localStorage.getItem('groupInvitationSuccess')) {
            localStorage.removeItem('groupInvitationSuccess');

            app.alerts.show(new Alert({
                type: 'success',
                children: app.translator.trans('clarkwinkelmann-group-invitation.forum.success-alert'),
            }));
        }
    });
});

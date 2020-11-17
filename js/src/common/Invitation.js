import Model from 'flarum/Model';

export default class Invitation extends Model {
    code = Model.attribute('code');
    hasUsagesLeft = Model.attribute('hasUsagesLeft');
    canUse = Model.attribute('canUse');
    usageCount = Model.attribute('usageCount');
    maxUsage = Model.attribute('maxUsage');
    createdAt = Model.attribute('createdAt', Model.transformDate);

    group = Model.hasOne('group');

    apiEndpoint() {
        return '/group-invitations' + (this.exists ? '/' + this.data.id : '');
    }
}

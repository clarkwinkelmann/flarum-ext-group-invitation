import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Invitation extends mixin(Model, {
    code: Model.attribute('code'),
    hasUsagesLeft: Model.attribute('hasUsagesLeft'),
    canUse: Model.attribute('canUse'),
    usageCount: Model.attribute('usageCount'),
    maxUsage: Model.attribute('maxUsage'),
    createdAt: Model.attribute('createdAt', Model.transformDate),

    group: Model.hasOne('group'),
}) {
    apiEndpoint() {
        return '/group-invitations' + (this.exists ? '/' + this.data.id : '');
    }
}

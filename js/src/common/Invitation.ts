import Model from 'flarum/common/Model';
import Group from 'flarum/common/models/Group';

export default class Invitation extends Model {
    code = Model.attribute<string>('code');
    hasUsagesLeft = Model.attribute<boolean>('hasUsagesLeft');
    canUse = Model.attribute<boolean>('canUse');
    usageCount = Model.attribute<number>('usageCount');
    maxUsage = Model.attribute<number>('maxUsage');
    createdAt = Model.attribute('createdAt', Model.transformDate);

    group = Model.hasOne<Group>('group');

    apiEndpoint() {
        return '/group-invitations' + (this.exists ? '/' + (this.data as any).id : '');
    }
}

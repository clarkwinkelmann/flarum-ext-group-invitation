<?php

namespace ClarkWinkelmann\GroupInvitation\Controllers;

use ClarkWinkelmann\GroupInvitation\Invitation;
use ClarkWinkelmann\GroupInvitation\Serializers\InvitationSerializer;
use ClarkWinkelmann\GroupInvitation\Validators\InvitationValidator;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class StoreController extends AbstractCreateController
{
    use AssertPermissionTrait;

    public $serializer = InvitationSerializer::class;

    public $include = [
        'group',
    ];

    protected $validator;

    public function __construct(InvitationValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $data = $request->getParsedBody();

        $this->validator->assertValid($data);

        $invitation = new Invitation();
        $invitation->code = str_random();
        $invitation->usage_count = 0;
        $invitation->max_usage = Arr::get($data, 'maxUsage') ?: null;
        $invitation->group()->associate(Arr::get($data, 'groupId'));
        $invitation->save();

        return $invitation;
    }
}

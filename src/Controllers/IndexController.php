<?php

namespace ClarkWinkelmann\GroupInvitation\Controllers;

use ClarkWinkelmann\GroupInvitation\Invitation;
use ClarkWinkelmann\GroupInvitation\Serializers\InvitationSerializer;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class IndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = InvitationSerializer::class;

    public $include = [
        'group',
    ];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        return Invitation::query()->orderBy('created_at')->get();
    }
}

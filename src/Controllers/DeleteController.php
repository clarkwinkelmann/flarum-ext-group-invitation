<?php

namespace ClarkWinkelmann\GroupInvitation\Controllers;

use ClarkWinkelmann\GroupInvitation\Invitation;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeleteController extends AbstractDeleteController
{
    use AssertPermissionTrait;

    protected function delete(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        /**
         * @var $invitation Invitation
         */
        $invitation = Invitation::query()->findOrFail($id);

        $invitation->delete();
    }
}

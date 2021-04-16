<?php

namespace ClarkWinkelmann\GroupInvitation\Controllers;

use ClarkWinkelmann\GroupInvitation\Invitation;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ApplyController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $code = Arr::get($request->getQueryParams(), 'code');

        /**
         * @var $invitation Invitation
         */
        $invitation = Invitation::query()->where('code', $code)->first();

        if (!$invitation) {
            throw new ValidationException([
                'code' => resolve(Translator::class)->trans('clarkwinkelmann-group-invitation.api.error.not-found'),
            ]);
        }

        if (!$invitation->hasUsagesLeft()) {
            throw new ValidationException([
                'code' => resolve(Translator::class)->trans('clarkwinkelmann-group-invitation.api.error.no-usages-left'),
            ]);
        }

        /**
         * @var $actor User
         */
        $actor = $request->getAttribute('actor');

        $actor->assertCan('use', $invitation);

        if (!$actor->groups->contains('id', $invitation->group->id)) {
            $actor->groups()->save($invitation->group);

            $invitation->usage_count++;
            $invitation->save();
        }

        return new EmptyResponse();
    }
}

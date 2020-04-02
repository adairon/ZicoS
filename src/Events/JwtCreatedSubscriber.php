<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event) {
        // 1. récupérer l'utilisateur pour avoir son id
        $user = $event->getUser();
        // 2. Enrichir les data pouyr qu'elles contiennent cette donnée
        $data = $event->getData();
        $data['id'] = $user->getId();
        $event->setData($data);
    }
}
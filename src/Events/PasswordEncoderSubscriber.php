<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    /**
     * On a besoin de l'encodeur de Symfony qu'on va appeler via une injection de dépendance
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        return[
            /*
            On se branche sur l'évènement VIEW du Kernel (après la désérialisation) 
            et avant l'écriture en base de données (PRE_WRITE)pour appeler une fonction qu'on 
            nomme encodePassword
            */
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    /* La fonction encodePassword prend un évènement en paramètre de type ViewEvent */
    public function encodePassword(ViewEvent $event) {
        
        /* On récupère le résultat du controller d'API Platform : objet désérialisé*/
        $user = $event->getControllerResult();
        
        /* On récupère la méthode de la requête : POST, GET, PUT, etc... */
        $method = $event->getRequest()->getMethod();
        
        /* On ne veut executer l'encodage que si on est dans le cadre de la création d'un user 
        donc une requête POST du User (et pas sur d'autres requêtes) */
        if($user instanceof User && $method === "POST") {
            $hash = $this->encoder->encodePassword($user, $user->getPassword());
            $user->setPassword($hash);
        }
    }
}
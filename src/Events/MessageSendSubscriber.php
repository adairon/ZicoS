<?php

namespace App\Events;

use App\Entity\Message;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MessageSendSubscriber implements EventSubscriberInterface 
{

    private $security;
    
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return[
            /*
            On se branche sur l'évènement VIEW du Kernel (après la désérialisation) 
            et avant la validation des données (PRE_VALIDATE) pour appeler notre fonction 
            setUserFrom
            */
            KernelEvents::VIEW => ['setUserFrom', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserFrom(ViewEvent $event){
        // On récupère les données passées par la requête :
        $message = $event->getControllerResult();
        // On récupère la méthode de la requête :
        $method = $event->getRequest()->getMethod();

        /*Si nos données sont une instance de l'entité Message et qu'on est en méthode POST
         (Donc qu'on est d'envoyer un message), alors, on attribue le user
        */
        if($message instanceof Message && $method === 'POST') {
            // On récupère l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            // assigner l'utilisateur au profil qu'on est en train de créer
            $message->setFromUser($user);
            // TODO : à déplacer dans une classe dédiée : sentAt maintenant
            if (empty($message->getSentAt())) {
                $message->setSentAt(new \DateTime());
            }
        }
    }
}
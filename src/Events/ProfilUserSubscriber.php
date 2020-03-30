<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Profile;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class ProfilUserSubscriber implements EventSubscriberInterface 
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
            setUserForProfile
            */
            KernelEvents::VIEW => ['setUserForProfile', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForProfile(ViewEvent $event){
        // On récupère les données passées par la requête :
        $profile = $event->getControllerResult();
        // On récupère la méthode de la requête :
        $method = $event->getRequest()->getMethod();

        /*Si nos données sont une instance de l'entité Profil et qu'on est en méthode POST
         (Donc qu'on est en train de créer un profil), alors, on attribue le user
        */
        if($profile instanceof Profile && $method === 'POST') {
            // On récupère l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            // assigner l'utilisateur au profil qu'on est en train de créer
            $profile->setUser($user);
        }
    }
}
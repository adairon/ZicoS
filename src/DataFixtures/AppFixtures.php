<?php

namespace App\DataFixtures;

use App\Entity\Instrument;
use App\Entity\Level;
use Faker\Factory;
use App\Entity\Type;
use App\Entity\User;
use App\Entity\Localization;
use App\Entity\Profile;
use App\Entity\Style;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder){
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        // On utilise la librairie faker pour générer de fausses données localisées en français
        $faker = Factory::create('fr_FR');

         //Création des styles:
         $style = ['Disco','Blues','Funk','Jazz','Metal','Pop','Punk','Rap','Rock','Country','Reggae','Afro','Ska','Soul','RnB','Zouk','Latino','Hard-Rock','Autre'];
         $tabObjStyle=[];
         foreach($style as $s){
             $style = new Style();
             $style->setName($s);
             $tabObjStyle[]=$style;
             $manager->persist($style);
         };

         // instruments
         $instrument = ['Guitare','Basse','Batterie','Piano','Clavier','Trompette','Saxophone','Clarinette','Xylophone','Violon','Alto','Contrebasse','Violoncelle','Percussions','Harmonica','Accordéon','Platines','Chant','Autre'];
         $tabObjInstrus=[];
        foreach($instrument as $i){
            $instrument = new Instrument();
            $instrument->setName($i);
            $tabObjInstrus[]=$instrument;
            $manager->persist($instrument);
        };

         // Levels
         $level = ['Débutant', 'Confirmé', 'Avancé'];
         $tabObjLevel=[];
         foreach($level as $l){
             $level = new Level();
             $level -> setName($l);
             $tabObjLevel[]=$level;
             $manager->persist($level);
         };

        /**
         * BOUCLE POUR CRÉER LES DONNÉES :
         * On Créé 2 types profils et pour chaque type, on créé 20 profils
         */

        // Création des types de profil :
        $type = ['musicien.ne', 'groupe'];
        $tabObjType=[];
        foreach($type as $t){
            $type = new Type();
            $type->setName($t);
            $tabObjType[]=$type;


             //dans la boucle de création des types, on créé 20 users musiciens et 20 users groupes :
             for ($u=1; $u <= 20; $u++){
                 
                //chaque user est une npouvelle instance de l'entité User
                $user = new User();
                //pour chaque user, on va "hasher" le password ("password")
                $hash = $this->encoder->encodePassword($user, "password");
                //n génère les informations de chaque user : email (avec faker) et password(avec le $hash)
                $user -> setEmail($faker->email)
                      -> setPassword($hash)
                      -> setBirthDate($faker->dateTimeBetween('-40 years'));
                // on fait "persister" le user créé
                $manager->persist($user);

                //nouvelle localisation pour chaque user:
                $localization = new Localization();
                $localization->setDepartement($faker->departmentName)
                             ->setDepartementNumber($faker->departmentNumber)
                             ->setRegion($faker->region);
                $manager->persist($localization);
                //Si c'est un musicien : alors on créé le profil avec nom de famille, instrument et niveau 
                if($type->getName() === "musicien.ne"){
                    //On créé une nouvelle instance de l'entité Profile
                    $profile = new Profile();
                    // On "rempli les différents champs du profil
                    $profile -> setFirstName($faker->firstName())
                             -> setLastName($faker->lastName)
                             -> setEmail($user->getEmail())
                             -> setBiography($faker->text($maxNbChars = 200))
                             -> setPictureUrl($faker->imageUrl('people'))
                             -> setLinkUrl($faker->url)
                             -> setType($type)
                             -> setLocalization($localization)
                             -> setUser($user)
                             -> setStyle($faker->randomElement($tabObjStyle))
                             -> setInstrument($faker->randomElement($tabObjInstrus))
                             -> setLevel($faker->randomElement($tabObjLevel));
                } elseif ($type->getName() === "groupe"){
                    //On créé une nouvelle instance de l'entité Profile et si c'est un groupe, on le fait comme suit :
                    $profile = new Profile();
                    // On "rempli les différents champs du profil
                    $profile -> setFirstName($faker->firstName())
                             -> setEmail($user->getEmail())
                             -> setBiography($faker->text($maxNbChars = 200))
                             -> setPictureUrl($faker->imageUrl('people'))
                             -> setLinkUrl($faker->url)
                             -> setType($type)
                             -> setLocalization($localization)
                             -> setUser($user)
                             -> setStyle($faker->randomElement($tabObjStyle));
                };
                $manager->persist($profile);
             };
            
            $manager->persist($type);

         };

        $manager->flush();
    }
}

<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints\NotCompromisedPassword;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE", "PATCH"},
 *  normalizationContext={
 *      "groups"={"user_read"}
 *  },
 *  denormalizationContext={"disable_type_enforcement"=true},
 * )
 * @UniqueEntity("email", message="Un compte existe déjà avec cette adresse email !")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_read","profiles_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"user_read","profiles_read"})
     * @Assert\NotBlank(message="Une adresse email est obligatoire pour se créer un compte !")
     * @Assert\Email(message="Le format de l'adresse email '{{ value }}' n'est pas valide")
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Un mot de passe est obligatoire !")
     * Assert\Length(min=8, minMessage="pour être un minimum sécurisé, votre mot de passe doit faire au moins {{ limit }} caractères")
     * @Assert\NotCompromisedPassword(message="Attention, ce mot de passe a déjà été compromis lors d'une fuite de données (à voir sur haveibeenpwned.com), merci de renseigner un mot de passe plus sécurisé.")
     */
    private $password;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Profile", mappedBy="user", cascade={"persist", "remove"})
     * @Groups({"user_read"})
     */
    private $profile;

    /**
     * @ORM\Column(type="date")
     * @Groups({"user_read","profiles_read"})
     * @Assert\NotBlank(message="Merci de renseigner votre date de naissance")
     * @Assert\Date(message="La date doit être au format AAAA-MM-JJ (année-mois-jour ; on y travaille...)")
     */
    private $birthDate;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(Profile $profile): self
    {
        $this->profile = $profile;

        // set the owning side of the relation if necessary
        if ($profile->getUser() !== $this) {
            $profile->setUser($this);
        }

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate($birthDate): self
    {
        $this->birthDate = $birthDate;

        return $this;
    }
}

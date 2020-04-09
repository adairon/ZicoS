<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProfileRepository")
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE", "PATCH"},
 *  normalizationContext={
 *      "groups"={"profiles_read"}
 *  },
 *  denormalizationContext={"disable_type_enforcement"=true},
 *  attributes={
 *      "order"={"id":"DESC"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Profile
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     * @Assert\NotBlank(message="Votre prénom ou le nom de votre groupe est obligatoire")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     * @Assert\NotBlank(message="Un email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email '{{ value }}' n'est pas valide")
     */
    private $email;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     * @Assert\Length(max=500, maxMessage="Votre texte est un peu trop long ! Il ne doit pas dépasser les {{ limit }} caractères")
     */
    private $biography;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     */
    private $pictureUrl;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     * @Assert\Url(message="'{{ value }}' n'est pas une url valide !")
     */
    private $linkUrl;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Type", inversedBy="profiles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"profiles_read", "instrument_read", "level_read", "localization_read", "style_read", "user_read"})
     * @Assert\NotNull(message="Merci de préciser quel type de profil vous vouler créer")
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Instrument", inversedBy="profiles")
     * @Groups({"profiles_read", "type_read", "level_read", "localization_read", "style_read", "user_read"})
     */
    private $instrument;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Localization", inversedBy="profiles")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "style_read", "user_read"})
     */
    private $localization;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Level", inversedBy="profiles")
     * @Groups({"profiles_read", "type_read", "instrument_read", "localization_read", "style_read", "user_read"})
     */
    private $level;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Style", inversedBy="profiles")
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "user_read"})
     */
    private $style;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\User", inversedBy="profile", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank(message="Un User est obligatoire")
     * @Groups({"profiles_read", "type_read", "instrument_read", "level_read", "localization_read", "style_read"})
     */
    private $user;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
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

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(?string $biography): self
    {
        $this->biography = $biography;

        return $this;
    }

    public function getPictureUrl(): ?string
    {
        return $this->pictureUrl;
    }

    public function setPictureUrl(?string $pictureUrl): self
    {
        $this->pictureUrl = $pictureUrl;

        return $this;
    }

    public function getLinkUrl(): ?string
    {
        return $this->linkUrl;
    }

    public function setLinkUrl(?string $linkUrl): self
    {
        $this->linkUrl = $linkUrl;

        return $this;
    }

    public function getType(): ?Type
    {
        return $this->type;
    }

    public function setType($type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getInstrument(): ?Instrument
    {
        return $this->instrument;
    }

    public function setInstrument(?Instrument $instrument): self
    {
        $this->instrument = $instrument;

        return $this;
    }

    public function getLocalization(): ?Localization
    {
        return $this->localization;
    }

    public function setLocalization(?Localization $localization): self
    {
        $this->localization = $localization;

        return $this;
    }

    public function getLevel(): ?Level
    {
        return $this->level;
    }

    public function setLevel(?Level $level): self
    {
        $this->level = $level;

        return $this;
    }

    public function getStyle(): ?Style
    {
        return $this->style;
    }

    public function setStyle(?Style $style): self
    {
        $this->style = $style;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

}

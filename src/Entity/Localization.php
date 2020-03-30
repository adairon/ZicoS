<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LocalizationRepository")
 * @ApiResource(
 * collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE", "PATCH"},
 *  normalizationContext={
 *      "groups"={"localization_read"}
 *  },
 *  attributes={
 *      "order":{"departementNumber" : "ASC"}
 *  }
 * )
 */
class Localization
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"localization_read", "profiles_read", "type_read", "instrument_read", "level_read", "style_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"localization_read", "profiles_read", "type_read", "instrument_read", "level_read", "style_read"})
     */
    private $region;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"localization_read", "profiles_read", "type_read", "instrument_read", "level_read", "style_read"})
     */
    private $departement;

    /**
     * @ORM\Column(type="integer", length=255, nullable=true)
     * @Groups({"localization_read", "profiles_read", "type_read", "instrument_read", "level_read", "style_read"})
     */
    private $departementNumber;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Profile", mappedBy="localization")
     * @Groups({"localization_read"})
     */
    private $profiles;

    public function __construct()
    {
        $this->profiles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRegion(): ?string
    {
        return $this->region;
    }

    public function setRegion(?string $region): self
    {
        $this->region = $region;

        return $this;
    }

    public function getDepartement(): ?string
    {
        return $this->departement;
    }

    public function setDepartement(?string $departement): self
    {
        $this->departement = $departement;

        return $this;
    }

    public function getDepartementNumber(): ?int
    {
        return $this->departementNumber;
    }

    public function setDepartementNumber(?int $departementNumber): self
    {
        $this->departementNumber = $departementNumber;

        return $this;
    }

    /**
     * @return Collection|Profile[]
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profile $profile): self
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles[] = $profile;
            $profile->setLocalization($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): self
    {
        if ($this->profiles->contains($profile)) {
            $this->profiles->removeElement($profile);
            // set the owning side to null (unless already changed)
            if ($profile->getLocalization() === $this) {
                $profile->setLocalization(null);
            }
        }

        return $this;
    }
}

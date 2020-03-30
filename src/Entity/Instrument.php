<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InstrumentRepository")
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE", "PATCH"},
 *  normalizationContext={
 *      "groups"={"instrument_read"}
 *  },
 *  attributes={
 *      "order":{"name" : "ASC"}
 *  }
 * )
 */
class Instrument
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"instrument_read", "profiles_read", "type_read", "level_read", "localization_read","style_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     * @Groups({"instrument_read", "profiles_read", "type_read", "level_read", "localization_read","style_read"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Profile", mappedBy="instrument")
     * @Groups({"instrument_read"})
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

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
            $profile->setInstrument($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): self
    {
        if ($this->profiles->contains($profile)) {
            $this->profiles->removeElement($profile);
            // set the owning side to null (unless already changed)
            if ($profile->getInstrument() === $this) {
                $profile->setInstrument(null);
            }
        }

        return $this;
    }
}

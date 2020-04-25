<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE", "PATCH"},
 *  normalizationContext={
 *      "groups"={"messages_read"}
 *  },
 * attributes={
 *      "order"={"sentAt":"DESC"}
 *  }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\MessageRepository")
 */
class Message
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messagesFor")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"messages_read"})
     */
    private $forUser;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messagesFrom")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"messages_read"})
     */
    private $fromUser;

    /**
     * @ORM\Column(type="text")
     * @Groups({"messages_read"})
     */
    private $message;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"messages_read"})
     */
    private $sentAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getForUser(): ?User
    {
        return $this->forUser;
    }

    public function setForUser(?User $forUser): self
    {
        $this->forUser = $forUser;

        return $this;
    }

    public function getFromUser(): ?User
    {
        return $this->fromUser;
    }

    public function setFromUser(?User $fromUser): self
    {
        $this->fromUser = $fromUser;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }
}

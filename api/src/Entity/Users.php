<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource]
#[ORM\Entity]
class Users
{
    use Traits\IdAware;
    use Traits\NameAware;
    use Traits\Timestampable;

    #[ORM\Column(type: Types::STRING, length: 42)]
    #[Assert\NotBlank]
    public string $ethWalletAddress;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank]
    public string $email;

    /** @var Collection<Company> $companies */
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Company::class)]
    public Collection $companies;
}

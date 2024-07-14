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
#[ORM\Table(name: 'users')]
class User
{
    use Traits\IdAware;
    use Traits\NameAware;
    // TODO use Traits\Timestampable;

    #[ORM\Column(type: Types::STRING, length: 42)]
    // #[Assert\Length(min: 42, max: 42)]
    public string $ethWalletAddress;

    #[ORM\Column(type: Types::STRING, length: 255)]
    // #[Assert\Email]
    public string $email;

    /** @var Collection<Company> $companies */
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Company::class)]
    public Collection $companies;
}

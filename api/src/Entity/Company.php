<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Processor\CompanyProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(processor: CompanyProcessor::class)]
#[ORM\Entity]
class Company
{
    use Traits\IdAware;
    use Traits\NameAware;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank]
    #[Assert\Country]
    #[Assert\Length(min: 10, max: 255)]
    public string $registrationNumber;

    #[ORM\Column(type: Types::STRING, length: 1024)]
    #[Assert\NotBlank]
    #[Assert\Country]
    #[Assert\Length(min: 5, max: 1024)]
    public string $address;

    #[ORM\Column(type: Types::STRING, length: 2)]
    #[Assert\NotBlank]
    #[Assert\Country]
    #[Assert\Length(min: 2, max: 2)]
    public string $countryCode;

    #[ORM\ManyToOne(targetEntity: User::class, cascade: ['persist'], inversedBy: 'companies')]
    #[ORM\JoinColumn(nullable: false)]
    public User $user;
}

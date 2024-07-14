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
    // TODO use Traits\Timestampable;

    #[ORM\ManyToOne(targetEntity: User::class, cascade: ['persist'], inversedBy: 'companies')]
    #[ORM\JoinColumn(nullable: false)]
    public User $user;
}

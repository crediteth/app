<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity]
class Company
{
    use Traits\IdAware;
    use Traits\NameAware;
    use Traits\Timestampable;

    #[ORM\ManyToOne(targetEntity: Users::class, cascade: ['persist'], inversedBy: 'companies')]
    #[ORM\JoinColumn(nullable: false)]
    public Users $user;
}

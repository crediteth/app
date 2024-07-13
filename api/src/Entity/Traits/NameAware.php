<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

trait NameAware
{
    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank]
    public string $name;
}

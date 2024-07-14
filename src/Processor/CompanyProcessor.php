<?php

declare(strict_types=1);

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Company;
use App\Service\Web3\SetCompany;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProcessorInterface<Company>
 */
final readonly class CompanyProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private SetCompany $setCompany,
    ) {
    }

    /** @param Company $data */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Company
    {
        $this->setCompany->sendTransaction($data);

        $this->em->persist($data);
        $this->em->flush();

        return $data;
    }
}

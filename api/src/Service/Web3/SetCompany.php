<?php

declare(strict_types=1);

namespace App\Service\Web3;

use App\Entity\Company;
use Exception;
use Web3\Contract;
use Web3\Eth;
use Web3\Web3;
use Web3p\EthereumTx\Transaction;

final readonly class SetCompany
{
    private const SMART_CONTRACT_NAME = 'setCompany';

    private Contract $contract;
    private Eth $eth;


    public function __construct(
        private string $host,
        private string $apiKey,
        private string $abi,
        private string $contractAddress,
        private string $privateKey,
        private string $fromAddress,
    ) {
        $web3 = new Web3($this->host . $this->apiKey);

        $this->contract = (new Contract($web3->getProvider(), $this->abi))->at($this->contractAddress);
        $this->eth = $web3->getEth();
    }

    public function sendTransaction(Company $company): void
    {
        $data = $this->callSmartContract($company);

        $transaction = new Transaction([
            'nonce' => $this->getTransactionCount(),
            'from' => $this->fromAddress,
            'to' => $this->contractAddress,
            'data' => $data,
            'gas' => $this->estimateGas($data),
            'gasPrice' => $this->getGasPrice(),
            'value' => '0x0',
        ]);

        $this->sendRawTransaction($transaction);
    }

    private static function toHex(string|int $txNonce): string
    {
        return '0x' . dechex((int) $txNonce);
    }

    private function getTransactionCount(): string
    {
        $txNonce = null;

        $this->eth->getTransactionCount($this->fromAddress, function ($err, $nonce) use (&$txNonce) {
            if ($err !== null) {
                throw new Exception($err->getMessage());
            }

            $txNonce = $nonce;
        });

        return self::toHex($txNonce);
    }

    private function callSmartContract(Company $company): string
    {
        return $this->contract->getData(
            self::SMART_CONTRACT_NAME,
            $company->user->ethWalletAddress,
            $company->name,
        );
    }

    private function estimateGas($data): string
    {
        $estimatedGas = $this->eth->estimateGas([
            'from' => $this->fromAddress,
            'to' => $this->contractAddress,
            'data' => $data,
        ]);

        return self::toHex($estimatedGas);
    }

    private function getGasPrice(): string
    {
        $gasPrice =  $this->eth->getGasPrice();

        return self::toHex($gasPrice);
    }

    private function sendRawTransaction(Transaction $transaction): void
    {
        $signedTransaction = '0x' . $transaction->sign($this->privateKey);

        $this->eth->sendRawTransaction($signedTransaction, function ($err, $txHash) {
            if ($err !== null) {
                throw new Exception($err->getMessage());
            }

            // TODO log/save transaction hash
            echo 'Transaction hash: ' . $txHash . PHP_EOL;
        });
    }
}

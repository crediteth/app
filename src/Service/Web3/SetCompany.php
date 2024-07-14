<?php

declare(strict_types=1);

namespace App\Service\Web3;

use App\Entity\Company;
use Exception;
use Web3\Contract;
use Web3\Eth;
use Web3\Web3;
use Web3\Utils;
use Web3p\EthereumTx\Transaction;

final readonly class SetCompany
{
    private const SMART_CONTRACT_NAME = 'setCompany';

    private Contract $contract;
    private Eth $eth;


    public function __construct(
        string $host,
        string $apiKey,
        array $abi,
        private string $contractAddress,
        private string $privateKey,
        private string $fromAddress,
        private string $chainId,
    ) {
        $web3 = new Web3($host . $apiKey);

        $this->contract = (new Contract($web3->getProvider(), $abi))->at($this->contractAddress);
        $this->eth = $web3->getEth();
    }

    public function sendTransaction(Company $company): void
    {
        $smartContractData = '0x' . $this->callSmartContract($company);
        $estimateGas = $this->estimateGas($smartContractData);

        $transaction = new Transaction([
            'nonce' => $this->getTransactionCount(),
            'from' => $this->fromAddress,
            'to' => $this->contractAddress,
            'data' => $smartContractData,
            'gas' => $estimateGas,
            'gasPrice' => $this->getGasPrice(),
            'chainId' => $this->chainId,
            'value' => '0x0',
        ]);

        $this->sendRawTransaction($transaction);
    }

    private static function toBytes32(string $input): string
    {
        if (is_numeric($input)) {
            $hex = dechex((int) $input);
        } else {
            $hex = bin2hex($input);
        }

        return substr(str_pad($hex, 64, '0', STR_PAD_LEFT), 0, 64);
    }

    private function getTransactionCount(): string
    {
        $this->eth->getTransactionCount($this->fromAddress, function ($err, $result) use (&$txNonce) {
            $this->throwOnError($err);

            $txNonce = $result;
        });

        return Utils::toHex($txNonce);
    }

    private function callSmartContract(Company $company): string
    {
        return $this->contract->getData(
            self::SMART_CONTRACT_NAME,
            $company->user->ethWalletAddress,
            ($company->name . $company->countryCode),
            // self::toBytes32($company->name) // TODO $company->signature
        );
    }

    /** @see \Web3\Methods\Eth\EstimateGas */
    private function estimateGas(string $smartContractData): string
    {
        $this->eth->estimateGas(
            [
                'from' => $this->fromAddress,
                'to' => $this->contractAddress,
                'data' => $smartContractData,
            ],
            function ($err, $result) use (&$estimatedGas) {
                $this->throwOnError($err);

                $estimatedGas = $result;
            },
        );

        return Utils::toHex($estimatedGas);
    }

    /** @see \Web3\Methods\Eth\GasPrice */
    private function getGasPrice(): string
    {
        $gasPrice = null;

        $this->eth->gasPrice(
            function ($err, $result) use (&$gasPrice) {
                $this->throwOnError($err);

                $gasPrice = $result;
            }
        );

        return Utils::toHex($gasPrice);
    }

    /** @see \Web3\Methods\Eth\SendRawTransaction */
    private function sendRawTransaction(Transaction $transaction): void
    {
        $signedTransaction = '0x' . $transaction->sign($this->privateKey);

        $this->eth->sendRawTransaction($signedTransaction, function ($err, $result) {
            $this->throwOnError($err);

            // TODO log/save transaction hash
            // echo 'Transaction hash: ' . $result . PHP_EOL;
        });
    }

    /**
     * @throws Exception
     */
    private function throwOnError($err): void
    {
        if ($err !== null) {
            throw new Exception($err->getMessage());
        }
    }
}

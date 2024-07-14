<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240714032539 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add basic User + Company tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE company_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 START 1');

        $sql = <<<SQL
CREATE TABLE company
(
    id                  INT                                                      NOT NULL,
    user_id             INT                                                      NOT NULL,
    registration_number VARCHAR(255)                                             NOT NULL,
    address             VARCHAR(1024)                                            NOT NULL,
    country_code        VARCHAR(2)                                               NOT NULL,
    name                VARCHAR(255)                                             NOT NULL,
    PRIMARY KEY (id)
)
SQL;
        $this->addSql($sql);
        $this->addSql('CREATE INDEX IDX_4FBF094FA76ED395 ON company (user_id)');

        $sql = <<<SQL
CREATE TABLE users
(
    id                 INT                                                      NOT NULL,
    eth_wallet_address VARCHAR(42)                                              NOT NULL,
    email              VARCHAR(255)                                             NOT NULL,
    name               VARCHAR(255)                                             NOT NULL,
    PRIMARY KEY (id)
)
SQL;
        $this->addSql($sql);

        $sql = <<<SQL
ALTER TABLE company
    ADD CONSTRAINT FK_4FBF094FA76ED395
        FOREIGN KEY (user_id)
            REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
SQL;
        $this->addSql($sql);
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP SEQUENCE company_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE users_id_seq CASCADE');

        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094FA76ED395');
        $this->addSql('DROP TABLE company');

        $this->addSql('DROP TABLE users');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200330091223 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE type (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE localization (id INT AUTO_INCREMENT NOT NULL, region VARCHAR(255) DEFAULT NULL, departement VARCHAR(255) DEFAULT NULL, departement_number INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE level (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (id INT AUTO_INCREMENT NOT NULL, type_id INT NOT NULL, instrument_id INT DEFAULT NULL, localization_id INT NOT NULL, level_id INT DEFAULT NULL, style_id INT DEFAULT NULL, user_id INT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) DEFAULT NULL, email VARCHAR(255) NOT NULL, birth_date DATE NOT NULL, biography LONGTEXT DEFAULT NULL, picture_url VARCHAR(255) DEFAULT NULL, link_url VARCHAR(255) DEFAULT NULL, INDEX IDX_8157AA0FC54C8C93 (type_id), INDEX IDX_8157AA0FCF11D9C (instrument_id), INDEX IDX_8157AA0F6A2856C7 (localization_id), INDEX IDX_8157AA0F5FB14BA7 (level_id), INDEX IDX_8157AA0FBACD6074 (style_id), UNIQUE INDEX UNIQ_8157AA0FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE instrument (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE style (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FC54C8C93 FOREIGN KEY (type_id) REFERENCES type (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FCF11D9C FOREIGN KEY (instrument_id) REFERENCES instrument (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0F6A2856C7 FOREIGN KEY (localization_id) REFERENCES localization (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0F5FB14BA7 FOREIGN KEY (level_id) REFERENCES level (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FBACD6074 FOREIGN KEY (style_id) REFERENCES style (id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT FK_8157AA0FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FC54C8C93');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FA76ED395');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0F6A2856C7');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0F5FB14BA7');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FCF11D9C');
        $this->addSql('ALTER TABLE profile DROP FOREIGN KEY FK_8157AA0FBACD6074');
        $this->addSql('DROP TABLE type');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE localization');
        $this->addSql('DROP TABLE level');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE instrument');
        $this->addSql('DROP TABLE style');
    }
}

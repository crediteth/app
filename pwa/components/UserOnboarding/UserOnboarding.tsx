import React from 'react';
import { Card, Row, Col } from 'antd';
import Image from 'next/image';
import styles from './styles.module.scss';

const featureData = [
  {
    iconSrc: "/assets/share.png",
    title: "Business web3 identity",
    description: "Credit3 provides a user-friendly way for businesses to claim a recognizable web3 identity on-chain by verifying the company through official company business registries and confirming the director's electronic signature.",
  },
  {
    iconSrc: "/assets/magnifying.png",
    title: "Risk assessment tools",
    description: "Credit3 pulls official company finances from company registries to analyze credit risk and compare them to the landscape of competitors. We use existing market-proven credit risk assessment tools such as Dun & Bradstreet credit scoring which are widely used by trade credit insurers worldwide.",
  },
  {
    iconSrc: "/assets/check.png",
    title: "AML and KYC",
    description: "We provide AML and KYC tools to identify our lenders and borrowers. Lenders are obliged to undergo the full AML and KYC verification in order for us to establish their risk profile and filter our entities under sanctioned or involved in money laundering. Lenders can request loans either from full AML and KYC participants or choose to get funded by from the wider community depending on their preferences.",
  },
  {
    iconSrc: "/assets/graph.png",
    title: "Democratizing trade finance",
    description: "Credit3 provides a unified global trade credit marketplace where trade finance participants can receive loans in a stable currency (USDT/EURC) irrespective of the marketplace where they operate.",
  },
];

const UserOnboard: React.FC = () => {
  return (
    <section className={styles.contentWrapper}>
      <Row gutter={[20, 20]}>
        {featureData.map((feature, index) => (
          <Col xs={24} sm={24} md={12} lg={12} key={index}>
            <Card className={styles.featureCard}>
              <Image src={feature.iconSrc} alt={feature.title} width={34} height={34} className={styles.icon} />
              <h2 className={styles.title}>{feature.title}</h2>
              <p className={styles.description}>{feature.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default UserOnboard;

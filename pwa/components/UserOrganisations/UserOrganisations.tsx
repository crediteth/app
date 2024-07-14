import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

interface UserOrganisationsProps {
  getAccounts: () => Promise<string[]>;
}

interface CompanyDetails {
  name: string;
  regNumber: string;
  address: string;
  country: string;
}

const UserOrganisations: React.FC<UserOrganisationsProps> = ({ getAccounts }) => {
  const [form] = Form.useForm();
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [creditScoreRequested, setCreditScoreRequested] = useState(false);
  const [amlVerificationRequested, setAmlVerificationRequested] = useState(false);
  const [creditRatingRequested, setCreditRatingRequested] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const accounts = await getAccounts();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    };
    fetchWalletAddress();
  }, [getAccounts]);

  const onFormChange = () => {
    const fields = form.getFieldsValue();
    const allFieldsFilled = Object.keys(fields).every(key => fields[key]);
    setIsFormComplete(allFieldsFilled);
  };

  const onFinish = (values: CompanyDetails) => {
    console.log('Success:', values);
    setCompanyDetails(values);
    setIsSaved(true);
    message.success('Organization info saved successfully!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill out all fields correctly.');
  };

  const handlePublish = () => {
    // Simulate publishing on chain process
    message.success('Published on chain successfully!');
  };

  return (
    <div className={styles.container}>
      {!isSaved ? (
        <div className={styles.formWrapper}>
          <div className={styles.description}>
            <h1>Create a Company Profile</h1>
            <p>Fill out the forms below to create your company profile. Please ensure all fields are completed
              accurately. After saving, you can request a credit score, AML verification, and credit rating, and publish your company profile on the blockchain.</p>
          </div>
          <Form
            form={form}
            name="organization_form"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onFormChange}
          >
            <Form.Item
              label="Company name"
              name="name"
              rules={[{ required: true, message: 'Please input the organization name!' }]}
            >
              <Input className={styles.input} />
            </Form.Item>
            <Form.Item
              label="Registration number"
              name="regNumber"
              rules={[{ required: true, message: 'Please input the registration number!' }]}
            >
              <Input className={styles.input} />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input the address!' }]}
            >
              <Input className={styles.input} />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please input the country!' }]}
            >
              <Input className={styles.input} />
            </Form.Item>
            <Form.Item label="Company director's signed document (EIDAS Signature)">
              <div className={styles.uploadSection}>
                <p>Download this file, sign it with your EIDAS Signature and upload it</p>
                <div className={styles.buttonGroup}>
                  <Button className={styles.actionButton}>Download</Button>
                  <Upload>
                    <Button icon={<UploadOutlined />} className={styles.actionButton}>Upload</Button>
                  </Upload>
                </div>
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!isFormComplete} className={styles.submitButton}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className={styles.savedInfo}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Company profile</h1>
            <div className={styles.walletNumber}>Wallet address: {walletAddress}</div>
          </div>
          <div className={styles.companyDetails}>
            <p><strong>Company name:</strong> {companyDetails?.name}</p>
            <p><strong>Registration number:</strong> {companyDetails?.regNumber}</p>
            <p><strong>Address:</strong> {companyDetails?.address}</p>
            <p><strong>Country:</strong> {companyDetails?.country}</p>
          </div>
          <div className={styles.actionButtonsWrapper}>
            <div className={styles.buttonGroup}>
              <Button
                className={styles.actionButton}
                onClick={() => setCreditScoreRequested(true)}
              >
                Request credit score
              </Button>
              <Button
                className={`${styles.statusButton} ${creditScoreRequested ? styles.successStatus : ''}`}
              >
                {creditScoreRequested ? 'A+' : 'Status'}
              </Button>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                className={styles.actionButton}
                onClick={() => setAmlVerificationRequested(true)}
              >
                Request AML verification
              </Button>
              <Button
                className={`${styles.statusButton} ${amlVerificationRequested ? styles.successStatus : ''}`}
              >
                {amlVerificationRequested ? 'AML check passed' : 'Status'}
              </Button>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                className={styles.actionButton}
                onClick={() => setCreditRatingRequested(true)}
              >
                Request credit rating
              </Button>
              <Button
                className={`${styles.statusButton} ${creditRatingRequested ? styles.successStatus : ''}`}
              >
                {creditRatingRequested ? '100 000$' : 'Status'}
              </Button>
            </div>
            <Button className={`${styles.publishButton} ${styles.actionButton}`} onClick={handlePublish}>
              Publish on chain
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrganisations;

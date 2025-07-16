import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import LendingForm from '../../components/lending/LendingForm';

/**
 * Lending Details Page - Displays and edits a single lending record.
 */
const LendingDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Placeholder: Fetch lending record by id if needed
  // const lending = ...

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Lending Details</h1>
        <LendingForm
          book={null}
          borrowers={[]}
          onSave={() => router.push('/lending')}
          onCancel={() => router.push('/lending')}
        />
      </div>
    </Layout>
  );
};

export default LendingDetailsPage;

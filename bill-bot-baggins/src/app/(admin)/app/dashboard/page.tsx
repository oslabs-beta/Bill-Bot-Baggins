import DashboardOverview from '@/src/components/dashboard-overview';
import { DataTable, Navbar } from '@/src/components/index';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';

export default async function Page() {
  return (
    <>
      <Navbar />
      <div className='h-5/6 flex-1 space-y-4 px-5 pt-4 lg:px-36'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <DashboardOverview />
          </TabsContent>
          <TabsContent value='analytics'>
            <DataTable />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

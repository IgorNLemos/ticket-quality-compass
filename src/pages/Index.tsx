
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-atlaskit-blue">Ticket Quality Compass</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Measure and improve your Jira ticket quality through structured assessments
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Measure Ticket Quality?</h2>
              <p className="mb-4">
                High-quality Jira tickets lead to better software, faster development cycles, and fewer miscommunications. 
                Ticket Quality Compass provides teams with a structured way to evaluate and improve their ticketing practices.
              </p>
              <p>
                Use consistent evaluation criteria to identify areas for improvement and track progress over time.
              </p>
            </div>
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80" 
                alt="Analytics Dashboard" 
                className="rounded-md shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Structured Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Use customizable criteria to evaluate tickets consistently across your team.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actionable Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Gain insights through comprehensive analytics and identify improvement areas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Monitor quality improvements over time with detailed historical data.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="space-x-4">
              <Button asChild>
                <Link to="/issue-panel">Try Evaluation Form</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin">View Analytics</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="pt-6">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4">Evaluation Form</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>8 customizable evaluation criteria</li>
                  <li>Intuitive slider controls (1-10 scale)</li>
                  <li>Qualitative feedback with markdown support</li>
                  <li>Ticket metadata display</li>
                  <li>Evaluation history tracking</li>
                  <li>Tooltips explaining each criterion</li>
                </ul>
              </div>
              <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80" 
                  alt="Evaluation Form" 
                  className="rounded-md shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center justify-center p-6 bg-muted rounded-lg md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80" 
                  alt="Analytics Dashboard" 
                  className="rounded-md shadow-lg max-w-full h-auto"
                />
              </div>
              <div className="md:order-2">
                <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Comprehensive filtering options</li>
                  <li>Score trending over time</li>
                  <li>Comparison across criteria</li>
                  <li>Assignee performance tracking</li>
                  <li>Exportable data (Excel, CSV, PDF)</li>
                  <li>Interactive visualizations</li>
                </ul>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4">Configuration</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Customizable evaluation criteria</li>
                  <li>Adjustable default values</li>
                  <li>Required/optional field settings</li>
                  <li>User permissions management</li>
                  <li>Form versioning for consistency</li>
                </ul>
              </div>
              <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80" 
                  alt="Configuration" 
                  className="rounded-md shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="demo" className="pt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Try Ticket Quality Compass</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Experience the evaluation form and analytics dashboard with our interactive demo.
              No installation required.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Issue Panel View</CardTitle>
                  <CardDescription>Experience the evaluation form</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild>
                    <Link to="/issue-panel">Open Issue Panel</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>Explore analytics and configuration</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild>
                    <Link to="/admin">Open Admin Panel</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-bold mb-2">Note about this Demo</h3>
            <p>
              This demo uses mock data to simulate the functionality of the Ticket Quality Compass app.
              In a real Atlassian Forge environment, the app would integrate directly with your Jira instance,
              allowing evaluation of your actual tickets and providing analytics based on your team's data.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

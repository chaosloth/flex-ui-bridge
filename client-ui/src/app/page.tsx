"use client";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import { Box } from "@twilio-paste/core/box";
import { Button } from "@twilio-paste/core/button";
import { Input } from "@twilio-paste/core/input";
import { Badge } from "@twilio-paste/core/badge";
import { Card } from "@twilio-paste/core/card";
import { Form, FormControl } from "@twilio-paste/core/form";
import { Heading } from "@twilio-paste/core/heading";
import { Label } from "@twilio-paste/core/label";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export enum Status {
  READY = "Ready",
  SUBMITTING = "Submitting",
  CREATED = "Created",
  ERROR = "Error",
}

export default function Home() {
  const params = useSearchParams();
  const phoneNumber = params.get("phoneNumber");
  const worker = params.get("worker");
  console.log(`params: ${params}`);

  console.log("Target phone number", phoneNumber);
  const [phone, setPhone] = useState(phoneNumber || "");
  const [taskStatus, setTaskStatus] = useState<Status>(Status.READY);
  const [worker_friendly_name, setWorkerFriendlyName] = useState(worker || "");

  const handleDial = () => {
    if (!phone || phone === "") return;
    if (!worker_friendly_name || worker_friendly_name === "") return;

    // Logic to initiate the phone call
    console.log(`Dialing ${phone}`);

    // Update the call status
    setTaskStatus(Status.SUBMITTING);

    // Here, you'd have logic to track the actual call status
    // and update it accordingly
    fetch(`${process.env.REACT_APP_DOMAIN_PREFIX || ""}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_type: "lead",
        attributes: { phone, worker_friendly_name },
      }),
    })
      .then(() => setTaskStatus(Status.CREATED))
      .catch((err) => {
        console.error("Error creating task", err);
        setTaskStatus(Status.ERROR);
      })
      .finally(() => setTimeout(() => setTaskStatus(Status.READY), 5000));
  };

  const getBadgeVariantForStatus = (status: Status) => {
    switch (status) {
      case Status.READY:
        return "neutral";
      case Status.CREATED:
        return "success";
      case Status.ERROR:
        return "error";
      case Status.SUBMITTING:
        return "new";
      default:
        return "neutral";
    }
  };

  return (
    <CustomizationProvider baseTheme="default" style={{ height: "100vh" }}>
      <Box>
        <Card>
          <Form aria-labelledby={"address-heading"}>
            <Heading
              as="h3"
              variant="heading30"
              id={"address-heading"}
              marginBottom="space0"
            >
              Click to dial in Flex
            </Heading>
            <FormControl>
              <Label htmlFor={"worker-name"}>Worker Name</Label>
              <Input
                type="text"
                placeholder="Enter worker friendly name"
                value={worker_friendly_name}
                onChange={(e) => setWorkerFriendlyName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleDial()}
              />
            </FormControl>
            <FormControl>
              <Label htmlFor={"phone-number"}>Phone Number</Label>
              <Input
                type="tel"
                placeholder="Enter phone number in E.164 format"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleDial()}
              />
            </FormControl>
            <FormControl>
              <Button variant="primary" onClick={handleDial}>
                Dial
              </Button>
            </FormControl>
            <FormControl>
              <Badge variant={getBadgeVariantForStatus(taskStatus)} as="span">
                {taskStatus}
              </Badge>
            </FormControl>
          </Form>
        </Card>
      </Box>
    </CustomizationProvider>
  );
}

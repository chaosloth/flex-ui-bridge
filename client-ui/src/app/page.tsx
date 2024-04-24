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
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Home() {
  const params = useSearchParams();
  const phoneNumber = params.get("phoneNumber");
  console.log(`params: ${params}`);

  console.log("Target phone number", phoneNumber);
  const [phone, setPhone] = useState(phoneNumber || "");
  const [callStatus, setCallStatus] = useState("");

  const handleDial = () => {
    if (!phone || phone === "") return;

    // Logic to initiate the phone call
    console.log(`Dialing ${phone}`);

    // Example: Update the call status
    setCallStatus("Sending...");

    // Here, you'd have logic to track the actual call status
    // and update it accordingly
    fetch(`${process.env.REACT_APP_DOMAIN_PREFIX || ""}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_type: "lead",
        attributes: { phone },
      }),
    })
      .then(() => {
        setCallStatus("Dialing...");
      })
      .catch(() => {
        setCallStatus("Something went wrong...");
      });
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
              {callStatus && (
                <Badge variant="default" as="span">
                  {callStatus}
                </Badge>
              )}
            </FormControl>
          </Form>
        </Card>
      </Box>
    </CustomizationProvider>
  );
}

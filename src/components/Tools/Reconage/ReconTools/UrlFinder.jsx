import React, { useState } from "react";
import styled from "styled-components";
import { MdContentCopy, MdFileDownload, MdSearch } from "react-icons/md";

const Container = styled.div`
    min-height: 100vh;
    background-color: #111;
    color: #fff;
    padding: 2rem;
    width: 100%;
    font-family: Arial, sans-serif;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    color: #f60;
    margin-bottom: 2rem;
`;

const Form = styled.form`
    margin-bottom: 2rem;
`;

const InputGroup = styled.div`
    display: flex;
`;

const Input = styled.input`
    flex-grow: 1;
    padding: 0.75rem;
    border-radius: 0.375rem 0 0 0.375rem;
    background-color: #222;
    border: 1px solid #333;
    color: #fff;

    &:focus {
        outline: none;
        border-color: #f60;
    }
`;

const Button = styled.button`
    background-color: #f60;
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 0 0.375rem 0.375rem 0;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e65c00;
    }

    &:disabled {
        background-color: #666;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    background-color: #f44;
    color: #fff;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
`;

const URLList = styled.div`
    background-color: #222;
    border-radius: 0.375rem;
    padding: 1rem;
`;

const URLItem = styled.li`
    margin-bottom: 0.5rem;

    &:last-child {
        margin-bottom: 0;
    }
`;

const URLLink = styled.a`
    color: #4da6ff;
    text-decoration: none;

    &:hover {
        color: #80bdff;
    }
`;

const ActionButton = styled.button`
    background-color: #333;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    margin-right: 1rem;

    &:hover {
        background-color: #444;
    }

    &:last-child {
        margin-right: 0;
    }
`;

const ActionBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
`;

const UrlFinder = () => {
    const [domain, setDomain] = useState("");
    const [subdomains, setURLs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setURLs([]);

        try {
            const response = await fetch("https://reconage-api.thecyberhub.org/api/urls", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ domain }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch subdomains");
            }

            const data = await response.json();
            console.log(data.urls);
            setURLs(data.urls || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const subdomainText = subdomains.join("\n");
        navigator.clipboard
            .writeText(subdomainText)
            .then(() => {
                alert("URLs copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    const handleDownload = () => {
        const subdomainText = subdomains.join("\n");
        const blob = new Blob([subdomainText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${domain}_subdomains.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    console.log(subdomains);

    return (
        <Container>
            <Title>URL Finder</Title>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="Enter domain (e.g., thecyberhub.org)"
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            "Searching..."
                        ) : (
                            <>
                                <MdSearch size={20} style={{ marginRight: "0.5rem" }} />
                                Search
                            </>
                        )}
                    </Button>
                </InputGroup>
            </Form>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {subdomains.length > 0 && (
                <div>
                    <ActionBar>
                        <ActionButton onClick={handleCopy}>
                            <MdContentCopy size={20} style={{ marginRight: "0.5rem" }} />
                            Copy
                        </ActionButton>
                        <ActionButton onClick={handleDownload}>
                            <MdFileDownload size={20} style={{ marginRight: "0.5rem" }} />
                            Download
                        </ActionButton>
                    </ActionBar>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>URLs Found:</h2>
                    <URLList>
                        <ul>
                            {subdomains.map((URL, index) => (
                                <URLItem key={index}>
                                    <URLLink href={`http://${URL}`} target="_blank" rel="noopener noreferrer">
                                        {URL}
                                    </URLLink>
                                </URLItem>
                            ))}
                        </ul>
                    </URLList>
                </div>
            )}
        </Container>
    );
};

export default UrlFinder;

import { useRouteError } from "react-router-dom";

export default function Error() {
    const error = useRouteError();
    console.log(error);   // tarkista konsolista virheen objektin sisältö

    // Tarkista, onko error olemassa ja onko siinä data-kenttä
    const errorMessage = error && error.data ? error.data : "Unknown error";

    return (
        <div>
            <h1>Page not found</h1>
            <p>{errorMessage}</p>
        </div>
    );
}
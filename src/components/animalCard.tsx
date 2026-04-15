import { useState } from "react";
import { useRouter } from "next/router";

export default function AnimalCard({name, breed, hours, pfp} : { name: string; breed: string; hours: string; pfp: string }) {
    return(
        <div>
           <img src={pfp}></img> 
           <h3>{name} - {breed}</h3>
            <p>Trained: {hours} hours</p> 
        </div>
    );
}
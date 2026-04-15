import { useState } from "react";
import { useRouter } from "next/router";

export default function AnimalCard({name, breed, hours, animalpfp, userpfp} : { name: string; breed: string; hours: string; animalpfp:string, userpfp: string }) {
    return(
        <div className="animalCard">
            

           <img className="animalImg" src={animalpfp}></img> 
           <div className="content">
           <h3>{name} - {breed}</h3>
           <div style={{ height:"10px" }}>
            
            <img className="pfp" src={userpfp}></img>
            </div>

            <p>Trained: {hours} hours</p> 
            </div>
        </div>
    );
}
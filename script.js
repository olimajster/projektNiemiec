$(function(){
    const rzedy = 8;
    const miejsca = 10;
    const litery = "ABCDEFGH";
    const procent_zajetych = 0.2;
    const selectFilmy = document.getElementById("filmy");
    const salaDiv = document.getElementById("sala");
    const podsumowanieDiv = document.getElementById("podsumowanie");

    //Osobna sala dla każdego seansu
    const sale = {};

    function losujSale(){
        const razem = rzedy * miejsca;
        const liczbaZajetych = Math.round(razem * procent_zajetych);
        const indeksy = [];
        for(let i = 0; i < razem; i++){
            indeksy.push(i);
        }

        //Tasowanie sali
        for(let i = indeksy.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = indeksy[i];
            indeksy[i] = indeksy[j];
            indeksy[j] = temp;
        }

        const zajete = indeksy.slice(0, liczbaZajetych);
        const sala = [];
        for(let r = 0; r < rzedy; r++){
            sala[r] = [];
            for(let m = 0; m < miejsca; m++){
                sala[r][m] = zajete.includes(r * miejsca + m) ? "zajete" : "wolne";
            }
        }
        return sala;
    }

    //Klasy Bootstrapa
    function Miejsca(status){
        const baza = "btn btn-sm w-100 ";
        if(status === "zajete") return baza + "btn-secondary";
        if(status === "wybrane") return baza + "btn-primary";
        return baza + "btn-outline-success";
    }

    function aktualizujPodsumowanie(idFilmu){
        const stan = sale[idFilmu];
        const wybrane = [];
        for(let r = 0; r < rzedy; r++){
            for(let m = 0; m < miejsca; m++){
                if(stan[r][m] === "wybrane"){
                    wybrane.push(litery[r] + (m + 1));
                }
            }
        }
        podsumowanieDiv.textContent = wybrane.length
            ? "Wybrane miejsca (" + wybrane.length + "): " + wybrane.join(", ")
            : "Nie wybrano jeszcze żadnego miejsca.";
    }

    function rysujSale(idFilmu){
        const stan = sale[idFilmu];
        salaDiv.innerHTML = "";

        for(let r = 0; r < rzedy; r++){
            const rzad = document.createElement("div");
            rzad.className = "row g-1 mb-1 align-items-center";

            const literaLewa = document.createElement("div");
            literaLewa.className = "col-1 text-center fw-bold";
            literaLewa.textContent = litery[r];
            rzad.appendChild(literaLewa);

            for(let m = 0; m < miejsca; m++){
                const kolumna = document.createElement("div");
                kolumna.className = "col";
                if(m === miejsca / 2 - 1){
                    kolumna.classList.add("me-3");
                }

                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = m + 1;
                btn.title = litery[r] + (m + 1);
                btn.className = Miejsca(stan[r][m]);

                if(stan[r][m] === "zajete"){
                    btn.disabled = true;
                }else{
                    btn.addEventListener("click", function(){
                        stan[r][m] = stan[r][m] === "wybrane" ? "wolne" : "wybrane";
                        btn.className = Miejsca(stan[r][m]);
                        aktualizujPodsumowanie(idFilmu);
                    });
                }

                kolumna.appendChild(btn);
                rzad.appendChild(kolumna);
            }

            const literaPrawa = document.createElement("div");
            literaPrawa.className = "col-1 text-center fw-bold";
            literaPrawa.textContent = litery[r];
            rzad.appendChild(literaPrawa);

            salaDiv.appendChild(rzad);
        }

        aktualizujPodsumowanie(idFilmu);
    }

    function pokazSeans(){
        const idFilmu = selectFilmy.options[selectFilmy.selectedIndex].id;
        if(!sale[idFilmu]){
            sale[idFilmu] = losujSale();
        }
        rysujSale(idFilmu);
    }

    selectFilmy.addEventListener("change", pokazSeans);
    pokazSeans();
})
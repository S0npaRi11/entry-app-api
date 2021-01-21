
 const evaluate = {
    step(previous,next){
        return previous += next;
    },

    monthly(entries,type){

        // first check if the entries actually do exists, if not return 0
        if(entries.length !== 0){
            // get the required dates
            let date = new Date()
            let maxDate = date;

            // console.log(maxDate)

            let maxMonth=  maxDate.getMonth();

            let value = 0;

            let minDay = maxDate.getDate();
            let minMonth = maxMonth === 1 ? 12 : maxMonth - 1;
            let minYear = maxDate.getFullYear();

            // console.log(minDay);
            // console.log(minMonth);
            // console.log(minYear);


            if(minMonth <= 0) minMonth = 12, minYear -= 1;

            // console.log(minMonth)
            // console.log(minYear)

            let minDate = new Date(minDay, minMonth, minYear);

            // console.log(minDate)

            // console.log([minDate, maxDate]);

            // filter the entries array according to dates and type
            let filteredEntries = entries.filter(entry => {
                if(entry.entryCreationDate >= minDate && entry.entryCreationDate <= maxDate && entry.type == type) return entry
            })

            // console.log(filteredEntries)

            // use forEach to get the value
            filteredEntries.forEach(entry => value += entry.amount);

            console.log(value);
            return value
        }else{
            return value = 0;
        }

        // console.log(value)
        // return the value
      
    },
 }

module.exports = evaluate;
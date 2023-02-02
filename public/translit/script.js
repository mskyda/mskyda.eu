const config = {
    'de_ru': [
        [['tsch', 'ч'], ['sch', 'ш'], ['ts', 'ц']],
        [['zh', 'ж'], ['ja', 'я']],
        [['ch', 'х'], ['h', 'х']],
        [['b', 'б']],
        [['ck', 'к'], ['c', 'к']],
        [['d', 'д']],
        [['f', 'ф'], ['v', 'ф']],
        [['g', 'г']],
        [['i', 'и'], ['j', 'й']],
        [['l', 'л']],
        [['m', 'м']],
        [['n', 'н']],
        [['p', 'п']],
        [['r', 'р']],
        [['s', 'с']],
        [['t', 'т']],
        [['u', 'у']],
        [['w', 'в'], ['q', 'кв']],
        [['x', 'кз'], ['y', `ы`], ['z', 'ц']],
        [['ß', 'cc'],['ä', 'э'], ['ö', `ё`], ['ü', 'ю']]
    ]
};
let mode = 'de_ru';

function translit(){

    const contentHolder = document.querySelector('#content');
    
    contentHolder.querySelectorAll('p').forEach((fragment, i) => {
        
        let fragmentContent = fragment.innerHTML;
        let prefix = '';

        config[mode].forEach((pairs, j) => {

            pairs.forEach(pair => {

                const regex = new RegExp(pair[0], 'ig');
                    
                if(j === i){
                    
                    prefix += `"${pair[0]}" - "${pair[1]}"<br> `;

                    fragmentContent = fragmentContent.replaceAll(regex, `{{{${pair[1]}}}}`);
                
                } else if (j < i) {

                    fragmentContent = fragmentContent.replaceAll(regex, pair[1]);

                }

            });

            fragmentContent = fragmentContent.replaceAll('{{{', '<span class="new">').replaceAll('}}}', '</span>');
    
            fragment.innerHTML = `<strong>${prefix}</strong>${fragmentContent}`;

        });

    });

}

translit();
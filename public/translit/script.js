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
        [['x', 'кз'], ['y', 'ы'], ['z', 'ц']],
        [['ß', 'cc'],['ä', 'э'], ['ö', `ё`], ['ü', 'ю']]
    ],
    'de_gr': [
        [['ps', 'ψ'], ['sch', 'σ'], ['ts', 'ζ']],
        [['ch', 'χ'], ['h', 'χ']],
        [['a', 'α'], ['e', 'ε']],
        [['th', 'θ'], ['ks', 'ξ']],
        [['b', 'β']],
        [['ck', 'κ'], ['c', 'κ']],
        [['d', 'δ']],
        [['f', 'φ'], ['v', 'φ']],
        [['g', 'γκ']],
        [['i', 'ι'], ['j', 'ι']],
        [['l', 'λ']],
        [['m', 'μ']],
        [['n', 'ν']],
        [['p', 'π']],
        [['r', 'ρ']],
        [['ß', 'σ'], ['s', 'σ']],
        [['t', 'τ']],
        [['u', 'ου']],
        [['w', 'β'], ['q', 'κβ']],
        [['x', 'ι'], ['y', 'υ'], ['z', 'ζ']],
        [['ä', 'αι'], ['ö', `ιο`], ['ü', 'ιυ']]
    ]
};


const input = document.querySelector('#input-select');
const output = document.querySelector('#output-select');
const contentHolder = document.querySelector('#content');
const content = contentHolder.innerHTML;

input.addEventListener("change", translit);
output.addEventListener("change", translit);

translit();

function translit(){

    contentHolder.innerHTML = content;
    
    contentHolder.querySelectorAll('p').forEach((fragment, i) => {
        
        let fragmentContent = fragment.innerHTML;
        let prefix = '';

        const mode = `${input.value}_${output.value}`;

        if(!mode || !config[mode]) { return; }

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
import { mount,createLocalVue } from '@vue/test-utils'
import elementUI from 'element-ui'
import paginator from '@/field/components/bos-paginator'


const localVue = createLocalVue()
localVue.use(elementUI)

const pageInfo = {
    totalPages:10,
    page:1
};
const wrapper = mount(paginator, {
    localVue,
    propsData: { pageInfo:pageInfo }
});

describe('bos-paginator.vue', () => {
    it('确定props参数正确', () => {
        expect(wrapper.vm.pageInfo.page).toBe(1)
    });
    it('渲染el-pagination',() => {
        const paginators = wrapper.findAll('.el-pagination');
        expect(paginators.length).toBe(1)
    });
    it('确定渲染正确页数',() => {
        const paginators = wrapper.findAll('.active').at(0);
        expect(paginators.element.innerHTML).toBe("1")
    });
    it('测试向后翻页功能',()=>{
        const next = wrapper.findAll('.btn-next');
        next.trigger('click');
        const act = wrapper.findAll('.active').at(0);
        expect(act.element.innerHTML).toBe("2");
    });
    it('测试选择页数功能',()=>{
        const page5 = wrapper.findAll('.number').at(4);
        page5.trigger('click');
        const act = wrapper.findAll('.active').at(0);
        expect(act.element.innerHTML).toBe("5");
    });
    it('测试向前翻页功能',()=>{
        const prev = wrapper.findAll('.btn-prev');
        prev.trigger('click');
        const act = wrapper.findAll('.active').at(0);
        expect(act.element.innerHTML).toBe("4");
    });
    it('测试快速向后翻页',()=>{
        let act = wrapper.findAll('.active').at(0);
        let beforePage = Number(act.element.innerHTML);
        let li = wrapper.findAll('li').at(testQuicknext(Number(act.element.innerHTML)));
        expect(li.classes('btn-quicknext')).toBe(true);
        li.trigger('click');
        act = wrapper.findAll('.active').at(0);
        expect(Number(act.element.innerHTML)).toBe(beforePage+5);
    });
    it('测试快速向前翻页',()=>{
        let act = wrapper.findAll('.active').at(0);
        let beforePage = Number(act.element.innerHTML);
        let li = wrapper.findAll('li').at(testQuicknext(Number(act.element.innerHTML)));
        expect(li.classes('btn-quickprev')).toBe(true);
        li.trigger('click');
        act = wrapper.findAll('.active').at(0);
        expect(Number(act.element.innerHTML)).toBe(beforePage-5);
    });
    it('是否同时存在前后快速翻页',()=>{
        let li = wrapper.findAll('li').at(4);
        li.trigger('click');
        let liArr = wrapper.findAll('li').length;
        let act = wrapper.findAll('.active').at(0);
        expect(Number(act.element.innerHTML)).toBe(wrapper.vm.pageInfo.totalPages/2);
        let prev = wrapper.findAll('li').at(1);
        expect(prev.classes('btn-quickprev')).toBe(true);
        let next = wrapper.findAll('li').at(liArr-2);
        expect(next.classes('btn-quicknext')).toBe(true);

    });
    it('是否成功返回$emit内容',(done)=>{
        let prev = wrapper.findAll('li').at(2);
        prev.trigger('click');
        let act = wrapper.findAll('.active').at(0);
        let nowPage = Number(act.element.innerHTML);
        let page = wrapper.emitted().bosCurrentPageChanged;
        wrapper.vm.$nextTick(() => {
            expect(page[page.length-1]).toEqual([nowPage]);
            done();
        });
    })
});

function testQuicknext(number) {
    if(number<5){
        return 6
    }else if(number>5){
        return 1
    }
}
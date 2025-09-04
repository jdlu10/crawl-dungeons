class UpdateItemMonsterIconFileNames < ActiveRecord::Migration[7.1]
  def change
    VisualRender.where(visual_type: ['item', 'monster']).each do |vr|
      if vr.url.end_with?('.svg')
        vr.update(url: vr.url.gsub('.svg', '.png'))
      end 
    end
  end
end

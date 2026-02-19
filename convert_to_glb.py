import bpy
import sys

# Clear default scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import FBX
bpy.ops.import_scene.fbx(filepath="/Users/JP/Documents/codding projects/git/personal/BirthdayWish/public/uploads_files_2921075_Cake.fbx")

# Export as GLB
bpy.ops.export_scene.gltf(
    filepath="/Users/JP/Documents/codding projects/git/personal/BirthdayWish/public/cake.glb",
    export_format='GLB',
    use_selection=False,
    export_apply=True,
)

print("CONVERSION_DONE")
